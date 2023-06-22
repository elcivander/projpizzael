import prismaClient from "../../prisma";
import { DetailsOrderService } from "./DetailsOrderService";

interface OrderRequest {
  id_pedido: string;
}

class FinishOrderService {
  async execute({ id_pedido }: OrderRequest) {
    const detailsOrderService = new DetailsOrderService();
    const order = await detailsOrderService.execute({ id_pedido });

    let subTotOrder = [];
    let totOrder = 0;

    order.Products.forEach((produto) => {
      let subtotal = produto.Qtde * produto.produto.preco;
      totOrder += subtotal;
      subTotOrder.push({
        [produto.produto.nome]: {
          Qtde: produto.Qtde,
          Valor: produto.produto.preco,
          Subtotal: subtotal,
        },
      });
    });

    return { Total: totOrder, Products: subTotOrder };
  }
}

export { FinishOrderService };
