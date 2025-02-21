/*
------------------------------------------------------------------------------ 
This code was generated by Amplication. 
 
Changes to this file will be lost if the code is regenerated. 

There are other ways to to customize your code, see this doc to learn more
https://docs.amplication.com/how-to/custom-code

------------------------------------------------------------------------------
  */
import { InputType, Field } from "@nestjs/graphql";
import { ApiProperty } from "@nestjs/swagger";
import { FrameComponent1WhereInput } from "./FrameComponent1WhereInput";
import { ValidateNested, IsOptional } from "class-validator";
import { Type } from "class-transformer";

@InputType()
class FrameComponent1ListRelationFilter {
  @ApiProperty({
    required: false,
    type: () => FrameComponent1WhereInput,
  })
  @ValidateNested()
  @Type(() => FrameComponent1WhereInput)
  @IsOptional()
  @Field(() => FrameComponent1WhereInput, {
    nullable: true,
  })
  every?: FrameComponent1WhereInput;

  @ApiProperty({
    required: false,
    type: () => FrameComponent1WhereInput,
  })
  @ValidateNested()
  @Type(() => FrameComponent1WhereInput)
  @IsOptional()
  @Field(() => FrameComponent1WhereInput, {
    nullable: true,
  })
  some?: FrameComponent1WhereInput;

  @ApiProperty({
    required: false,
    type: () => FrameComponent1WhereInput,
  })
  @ValidateNested()
  @Type(() => FrameComponent1WhereInput)
  @IsOptional()
  @Field(() => FrameComponent1WhereInput, {
    nullable: true,
  })
  none?: FrameComponent1WhereInput;
}
export { FrameComponent1ListRelationFilter as FrameComponent1ListRelationFilter };
