"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.prepareParams = void 0;
const prepareParams = (options, actualParams = {}, relationsModels = {}, selectParams = {}) => {
    let { filter = {}, sort = {}, take = 20, page, search = {} } = options;
    filter = convertToJson(filter);
    sort = convertToJson(sort);
    const searchParams = convertToJson(search);
    let searchFields = {};
    Array.from(Object.keys(searchParams)).map((key) => {
        searchFields[key] = { contains: searchParams[key], mode: 'insensitive' };
    });
    let skip = page > 1 ? (take * page) - take : 0;
    return Object.assign(Object.assign({ where: { AND: Object.assign(Object.assign(Object.assign({}, filter), searchFields), actualParams) }, orderBy: sort, take: +take, skip }, relationsModels), selectParams);
};
exports.prepareParams = prepareParams;
const convertToJson = (param) => {
    try {
        return param ? JSON.parse(param) : {};
    }
    catch (error) {
        return {};
    }
};
//# sourceMappingURL=search.js.map