import { BaseService } from '@/modules/database/base';
import { Injectable } from '@nestjs/common';
import { AddressEntity } from '../entities';
import { AddressRepository } from '../repositories';
import { CreateAddressDto, UpdateAddressDto } from '../dtos/address.dto';
import { omit } from 'lodash';

@Injectable()
export class AddressService extends BaseService<AddressEntity, AddressRepository> {
  constructor(
    private addressRepository: AddressRepository,
  ) {
    super(addressRepository);
  }

  async create(data: CreateAddressDto) {
    return await this.addressRepository.save(data);
  }

  async update(data: UpdateAddressDto) {
    await this.addressRepository.update(data.id, omit(data, ['id', 'address']));
    return this.detail(data.id);
  }
}
