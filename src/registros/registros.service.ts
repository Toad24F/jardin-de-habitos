import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UpdateRegistroDto } from './dto/update-registro.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRegistroDiaDto } from './dto/create-registro.dto';
import { RegistroDia } from './entities/registro.entity';
import { Habito } from 'src/habitos/entities/habito.entity';

@Injectable()
export class RegistrosService {
  constructor(
    @InjectRepository(RegistroDia)
    private registroDiaRepository: Repository<RegistroDia>,
    @InjectRepository(Habito)
    private habitoRepository: Repository<Habito>,
  ) {}

  /**
   * Registra el seguimiento diario de un hábito y actualiza la lógica de la mata.
   * @param createRegistroDiaDto Datos del formulario de registro.
   * @param idUsuario ID del usuario autenticado.
   */
  async create(createRegistroDiaDto: CreateRegistroDiaDto, idUsuario: string): Promise<RegistroDia> {
    
    const { id_habito, veces_realizadas } = createRegistroDiaDto;

    
    // 1. Verificar si el hábito existe y pertenece al usuario (seguridad)
    const habito = await this.habitoRepository.findOneBy({ 
        id: id_habito, 
        id_usuario: idUsuario 
    });
    if (!habito) {
        throw new NotFoundException(`Hábito con ID ${id_habito} no encontrado o no pertenece al usuario.`);
    }
    let frecuencia = habito.frecuencia_diaria;
    let estado = 0;
    // 2. Comprobar si ya existe un registro para hoy (Prevención de duplicados)
    // Nota: Por simplicidad, asumimos "hoy" como una fecha sin hora.
    const today = new Date().toISOString().split('T')[0];
    
    //Esto esta comentado pero es la manera de no poder crear dos registros en el mismo dia
    /*
    *  const registroExistente = await this.registroDiaRepository
    *    .createQueryBuilder('registro')
    *    .where('registro.id_habito = :idHabito', { idHabito: id_habito })
    *    .andWhere('registro.fecha = :fecha', { fecha: today })
    *    .getOne();
    *
    *if (registroExistente) {
    *    throw new ConflictException('Ya existe un registro para este hábito hoy.');
    *}
    */
    // 3. Crear el nuevo registro diario
        switch (true) {
      case veces_realizadas >= frecuencia:
        estado = 1; // Mal
        break;
      case veces_realizadas < frecuencia && veces_realizadas > 0:
        estado = 2; // Regular
        break;
      case veces_realizadas === 0:
        estado = 3; // Bien
        break;
    }
    const nuevoRegistro = this.registroDiaRepository.create({
        ...createRegistroDiaDto,
        id_usuario: idUsuario,
        fecha: new Date(today), // Guardamos la fecha limpia
        estado: estado,
    });
    const registroGuardado = await this.registroDiaRepository.save(nuevoRegistro);
    
    // 4. Aplicar la lógica de la "Mata del Hábito"
    this.actualizarMata(habito, veces_realizadas);
    return registroGuardado;
  }

  /**
   * Aplica la lógica de crecimiento/decaimiento al hábito.
   * @param habito La entidad Hábito a actualizar.
   * @param vecesRealizadas Cuántas veces se hizo el hábito hoy.
   */
  private async actualizarMata(habito: Habito, vecesRealizadas: number): Promise<void> {
    
    // Usamos variables para los nuevos valores
    let nuevaEtapa = habito.etapa_mata;

    let nuevoCalificador = habito.calificador_crecimiento;
    // --- LÓGICA DE EXITO (veces_realizadas = 0) ---
    if (vecesRealizadas === 0) {
        // Aumentar el calificador (hasta 3)
        nuevoCalificador = nuevoCalificador + 1;
        
        if (nuevoCalificador > 3) {
            // Reiniciar el calificador y aumentar la etapa (la mata crece)
            nuevoCalificador = 1; // Reiniciar a 1 
            if (nuevaEtapa < 10) {
              nuevaEtapa = nuevaEtapa + 1; // La etapa de la mata se suma en 1
            } else {
              nuevaEtapa = 10; // Aseguramos que la etapa maxima es 10 
            }
        }
    } 
    // --- LÓGICA DE FALLO(veces_realizadas > 0) ---
    else {
        // Reducir el calificador (hasta 0)
        nuevoCalificador = nuevoCalificador - 1;
        if (nuevoCalificador < 0) {
            // Reiniciar el calificador y reducir una etapa (la mata decae)
            nuevoCalificador = 3; // Reiniciar a 3 
            if (nuevaEtapa > 1) {
              nuevaEtapa = nuevaEtapa - 1; // La etapa de la mata se resta en 1
            } else {
              nuevaEtapa = 1; // Aseguramos que la etapa mínima es 1 (Semilla)
            }
        }
    }
    // 5. Guardar los cambios del hábito (si los hay)
    if (nuevaEtapa !== habito.etapa_mata || nuevoCalificador !== habito.calificador_crecimiento) {
      await this.habitoRepository.update(habito.id, {
        etapa_mata: nuevaEtapa,
        calificador_crecimiento: nuevoCalificador,
      });
    }

  }

  async findAll(id_habito: string, id_usuario: string): Promise<RegistroDia[]> {
    const registros = await this.registroDiaRepository.find({
      where: { 
        id_usuario: id_usuario,
        id_habito: id_habito,
      },
    });
    if (registros.length === 0) {
        throw new NotFoundException(`No se encontraron registros para el hábito con ID ${id_usuario}.`);
    }
    return registros;
  }

  findOne(id: number) {
    return `This action returns a #${id} registro`;
  }

  update(id: number, updateRegistroDto: UpdateRegistroDto) {
    return `This action updates a #${id} registro`;
  }

  remove(id: number) {
    return `This action removes a #${id} registro`;
  }
}
