import { Injectable, NotFoundException } from '@nestjs/common';
import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm'; 

import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity'; 

@Injectable()
export class UsuariosService {
  //Inyecta el Repositorio de Usuario en el constructor
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  //Cambia la lógica para que use la base de datos
  async create(createUsuarioDto: CreateUsuarioDto): Promise<Usuario> {
    
    // 1. 💡 VERIFICACIÓN DE UNICIDAD DEL EMAIL 
    const usuarioExistente = await this.usuariosRepository.findOne({ 
      where: { email: createUsuarioDto.email } 
    });

    if (usuarioExistente) {
      // Si el email ya está en uso, lanzamos una excepción 409 Conflict
      throw new ConflictException(`El correo "${createUsuarioDto.email}" ya está en uso.`);
    }

    // 2. Hasheamos la contraseña
    // Nota: Asegúrate de que bcrypt esté instalado: npm install bcrypt
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(createUsuarioDto.password, salt);

    // 3. Creamos el usuario pero reemplazamos el password por el hash
    const nuevoUsuario = this.usuariosRepository.create({
      ...createUsuarioDto,
      password: hashedPassword, // Guardamos el hash
    });

    // 4. Guardamos el nuevo usuario y retornamos el resultado
    return this.usuariosRepository.save(nuevoUsuario);
  }

  async findAll(): Promise<Usuario[]> {
    return await this.usuariosRepository.find();
  }

  async findOneByEmail(email: string) {
    // Usamos 'addSelect' para incluir el password,
    // que por defecto está oculto en la entidad.
    return this.usuariosRepository
      .createQueryBuilder('usuario')
      .where('usuario.email = :email', { email })
      .addSelect('usuario.password')
      .getOne();
  }
  
  async findOne(id: string): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOneBy({ id });
    if (!usuario) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    return usuario;
  }

  async update(id: string, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    // mejor usar preload para combinar y validar existencia
    const usuario = await this.usuariosRepository.preload({ id, ...updateUsuarioDto });
    if (!usuario) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    return this.usuariosRepository.save(usuario);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usuariosRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
  }
}