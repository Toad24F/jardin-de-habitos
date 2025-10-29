import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm'; 
import { Repository } from 'typeorm'; 
import * as bcrypt from 'bcrypt';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { Usuario } from './entities/usuario.entity'; 

@Injectable()
export class UsuariosService {
  // 4. Inyecta el Repositorio de Usuario en el constructor
  constructor(
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
  ) {}

  // 5. Cambia la lógica para que use la base de datos
  async create(createUsuarioDto: CreateUsuarioDto) {
  // Hasheamos la contraseña
  const salt = await bcrypt.genSalt();
  const hashedPassword = await bcrypt.hash(createUsuarioDto.password, salt);

  // Creamos el usuario pero reemplazamos el password por el hash
  const nuevoUsuario = this.usuariosRepository.create({
    ...createUsuarioDto,
    password: hashedPassword, // Guardamos el hash, no el original
  });

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
  
  async findOne(id: number): Promise<Usuario> {
    const usuario = await this.usuariosRepository.findOneBy({ id });
    if (!usuario) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    return usuario;
  }

  async update(id: number, updateUsuarioDto: UpdateUsuarioDto): Promise<Usuario> {
    // mejor usar preload para combinar y validar existencia
    const usuario = await this.usuariosRepository.preload({ id, ...updateUsuarioDto });
    if (!usuario) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
    return this.usuariosRepository.save(usuario);
  }

  async remove(id: number): Promise<void> {
    const result = await this.usuariosRepository.delete(id);
    if (result.affected === 0) throw new NotFoundException(`Usuario con id ${id} no encontrado`);
  }
}