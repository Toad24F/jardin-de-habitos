import { PartialType } from '@nestjs/mapped-types';
import { CreateRegistroDiaDto } from './create-registro.dto';

export class UpdateRegistroDto extends PartialType(CreateRegistroDiaDto) {}
