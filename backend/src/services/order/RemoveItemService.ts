import prismaClient from "../../prisma";

interface ItemRequest {
  id_item: string;
}

class RemoveItemService {
  async execute({ id_item }: ItemRequest) {
    const item = await prismaClient.item.findUnique({
      where: {
        id: id_item,
      },
      select: {
        id: true,
        pedido: true,
      },
    });

    if (!item) {
      throw new Error("Item inválido!");
    }

    if (!item.pedido.rascunho) {
      throw new Error("Pedido fechado");
    }

    const itemRemove = await prismaClient.item.delete({
      where: {
        id: item.id,
      },
    });

    return itemRemove;
  }
}

export { RemoveItemService };
