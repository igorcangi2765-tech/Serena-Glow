import prisma from '../config/db.js';

export const createSale = async (req, res) => {
  const { total, payment_method, customer_id, items } = req.body;
  try {
    const result = await prisma.$transaction(async (tx) => {
      // 1. Create Sale
      const sale = await tx.sale.create({
        data: {
          total,
          payment_method,
          customer_id
        }
      });

      // 2. Create Sale Items
      const saleItems = items.map(item => ({
        sale_id: sale.id,
        service_id: item.service_id,
        quantity: item.quantity,
        unit_price: item.unit_price
      }));

      await tx.saleItem.createMany({
        data: saleItems
      });

      // 3. Update Client Stats if applicable
      if (customer_id) {
        await tx.client.update({
          where: { id: customer_id },
          data: {
            total_spent: { increment: total },
            total_appointments: { increment: 1 },
            last_visit: new Date()
          }
        });
      }

      return sale;
    });

    res.status(201).json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao processar venda', detail: error.message });
  }
};

export const getSalesReport = async (req, res) => {
  try {
    const sales = await prisma.sale.findMany({
      include: {
        client: true,
        items: {
          include: { service: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });
    res.json(sales);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar relatório', detail: error.message });
  }
};
