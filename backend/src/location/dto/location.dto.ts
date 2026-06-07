import { IsOptional, IsString, IsNumber, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateLocationDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  ten_vi_tri: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  tinh_thanh: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  quoc_gia: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  hinh_anh: string;
}

export class UpdateLocationDto {
  @ApiProperty()
  @IsNumber()
  id: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  ten_vi_tri?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  tinh_thanh?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  quoc_gia?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  hinh_anh?: string;
}
