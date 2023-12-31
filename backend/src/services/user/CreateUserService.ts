import prismaClient from "../../prisma";
import { hash } from "bcryptjs";

interface UserRequest {
  nome: string;
  email: string;
  senha: string;
}

class CreateUserService {
  async execute({ nome, email, senha }: UserRequest) {
    // Verificar se foi enviado o valor do e-mail
    if (!email) {
      throw new Error("E-mail não enviado!!");
    }

    // Verifica se o email já foi cadastrado
    const UserAlreadyExists = await prismaClient.usuario.findFirst({
      where: {
        email: email,
      },
    });

    if (UserAlreadyExists) {
      throw new Error("E-mail já existe!!");
    }

    const palavrapasse = await hash(senha, 8);

    const user = await prismaClient.usuario.create({
      data: {
        nome: nome,
        email: email,
        senha: palavrapasse,
      },
      select: {
        id: true,
        nome: true,
        email: true,
      },
    });

    return user;
  }
}

export { CreateUserService };
