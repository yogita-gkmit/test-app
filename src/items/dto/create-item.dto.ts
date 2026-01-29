import { IsOptional, IsString, Length } from "class-validator";

export class CreateItemDto {
  @IsString()
  @Length(2, 255)
  name: string;

  @IsOptional()
  @IsString()
  @Length(20, 255)
  description?: string;
}
