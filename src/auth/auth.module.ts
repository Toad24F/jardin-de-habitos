import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt'; 
import { UsuariosModule } from 'src/usuarios/usuarios.module';

@Module({
  imports: [
    UsuariosModule, // Necesitamos el UsuariosService para buscar usuarios
    
    // Configura el módulo de Passport
    PassportModule.register({ defaultStrategy: 'jwt' }),
    
    // Configura el módulo de JWT (aquí defines el token)
    JwtModule.register({
      secret: 'parangatutirimicuaro', // ¡MUY IMPORTANTE!
      signOptions: { expiresIn: '1h' }, // El token expira en 1 hora
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService], // Añadiremos la "Estrategia" aquí en un momento
})
export class AuthModule {}