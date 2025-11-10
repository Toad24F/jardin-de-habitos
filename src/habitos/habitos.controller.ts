import { Controller, Get, Post, Body, Patch, Param, Delete,UseGuards,Req } from '@nestjs/common';
import { HabitosService } from './habitos.service';
import { CreateHabitoDto } from './dto/create-habito.dto';
import { UpdateHabitoDto } from './dto/update-habito.dto';
import { AuthGuard } from '@nestjs/passport'; 

import type { Request } from 'express';

@Controller('habitos')
export class HabitosController {
  constructor(private readonly habitosService: HabitosService) {}

 /**
   * Ruta para CREAR un nuevo hábito.
   * Protegida por JWT.
   */
  @Post()
  @UseGuards(AuthGuard('jwt')) //Proteger la ruta
  create(
    @Body() createHabitoDto: CreateHabitoDto,
    @Req() req: Request, 
  ) {
    //Extraer el ID del usuario (que JwtStrategy puso en req.user)
    const idDelUsuario = (req.user as any).id_usuario; 
    // (o (req.user as any).sub, dependiendo de tu JwtStrategy)

    //Llamar al servicio con AMBOS datos
    return this.habitosService.create(createHabitoDto, idDelUsuario);
  }

      /**
     * Ruta para OBTENER TODOS los hábitos del usuario autenticado.
     * Protegida por JWT.
     */
    @Get()
    @UseGuards(AuthGuard('jwt')) // Proteger también la ruta GET
    findAll(@Req() req: Request) { //Inyectar el objeto Request
        // Extraer el ID del usuario del token
        const idDelUsuario = (req.user as any).id_usuario; 
        // Llamar al servicio con el ID del usuario
        return this.habitosService.findAll(idDelUsuario); // 💡 Pasamos el ID real
    }

  @Get(':id')
  @UseGuards(AuthGuard('jwt')) // 💡 Proteger también la ruta GET
  findOne(@Param('id') id: string, @Req() req: Request) {
    const idDelUsuario = (req.user as any).id_usuario; 
    return this.habitosService.findOne(id, idDelUsuario); // 💡 Pasamos el ID real
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateHabitoDto: UpdateHabitoDto) {
    return this.habitosService.update(id, updateHabitoDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.habitosService.remove(id);
  }
}
