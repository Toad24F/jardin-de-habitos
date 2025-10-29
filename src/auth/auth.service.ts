import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { LoginDto } from './dto/login.dto'; // <-- Crearemos este archivo ahora

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService, // Para buscar usuarios
    private jwtService: JwtService, // Para crear el token
  ) {}

  /**
   * Valida un usuario contra la base de datos y genera un token si es exitoso.
   */
  async login(loginDto: LoginDto) {
    // 1. Buscar al usuario por email
    // (Añadiremos un 'findOneByEmail' al UsuariosService)
    const usuario = await this.usuariosService.findOneByEmail(loginDto.email);

    if (!usuario) {
      throw new UnauthorizedException('Credenciales inválidas (email)');
    }

    // 2. Comparar la contraseña enviada con el hash de la BD
    const esPasswordCorrecto = await bcrypt.compare(
      loginDto.password,
      usuario.password, // Recuerda que este campo está oculto por defecto (select: false)
    );

    if (!esPasswordCorrecto) {
      throw new UnauthorizedException('Credenciales inválidas (password)');
    }

    // 3. Si todo está bien, generar el JWT
    const payload = { sub: usuario.id, email: usuario.email }; // 'sub' (subject) es el ID del usuario

    return {
      message: 'Login exitoso',
      access_token: this.jwtService.sign(payload),
    };
  }
}