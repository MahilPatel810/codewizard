const prisma = require('../lib/prisma');

exports.searchStudents = async (req, res) => {
  try {
    const { q, batch } = req.query;
    const where = {
      role: 'student'
    };

    if (q) {
      where.OR = [
        { userId: { contains: q, mode: 'insensitive' } },
        { name: { contains: q, mode: 'insensitive' } }
      ];
    }

    if (batch) {
      where.batch = batch;
    }

    const students = await prisma.user.findMany({
      where,
      select: {
        id: true,
        userId: true,
        name: true,
        batch: true,
        department: true
      },
      take: 50,
      orderBy: { userId: 'asc' }
    });

    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error searching student records.', error: error.message });
  }
};
