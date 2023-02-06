import { OptionsDto } from "./dto/options.dto";

export const prepareParams = (options: OptionsDto, actualParams = {}, relationsModels = {}, selectParams = {}) => {
  let { filter = {}, sort = {}, take = 20, page, search = {} } = options;
  filter = convertToJson(filter);
  sort = convertToJson(sort);
  const searchParams = convertToJson(search);
  let searchFields = {}

  Array.from(Object.keys(searchParams)).map((key) => {
    searchFields[key] = { contains: searchParams[key], mode: 'insensitive' }
  })

  let skip: number = page > 1 ? (take * page) - take : 0;
  return {
    where: { AND: { ...filter, ...searchFields, ...actualParams } },
    orderBy: sort,
    take: +take,
    skip,
    ...relationsModels,
    ...selectParams
  }
}

const convertToJson = (param: any) => {
  try {
    return param ? JSON.parse(param) : {};
  } catch (error) {
    return {}
  }
}
