"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateRdisCacheDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_rdis_cache_dto_1 = require("./create-rdis-cache.dto");
class UpdateRdisCacheDto extends (0, mapped_types_1.PartialType)(create_rdis_cache_dto_1.CreateRdisCacheDto) {
}
exports.UpdateRdisCacheDto = UpdateRdisCacheDto;
//# sourceMappingURL=update-rdis-cache.dto.js.map