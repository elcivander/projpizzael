import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface AuthRequest {
  email: string;
  senha: string;
}

class AuthUserService {
  async execute({ email, senha }: AuthRequest) {
    const user = await prismaClient.usuario.findFirst({
      where: {
        email: email,
      },
    });

    if (!user) {
      throw new Error("Email não existe!!");
    }
    const senhaMatch = await compare(senha, user.senha);

    if (!senhaMatch) {
      throw new Error("Senha incorreta!");
    }

    const token = sign(
      {
        nome: user.nome,
        usuario: user.email,
      },
      
      process.env.JWT_SECRET,
     
    );
    return {
      id: user.id,
      nome: user.nome,
      email: user.email,
      token: token,
    };
  }
}

export { AuthUserService };
