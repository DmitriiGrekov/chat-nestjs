"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserFromSocket = void 0;
const jwt_1 = require("@nestjs/jwt");
async function getUserFromSocket(socket) {
    var _a;
    const jwtService = new jwt_1.JwtService();
    const token = (_a = socket.handshake.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    let userId;
    const payload = jwtService.decode(token);
    if (!payload) {
        return null;
    }
    userId = payload.sub;
    const roomId = +socket.handshake.query.room_id;
    const socketId = socket.id;
    return { userId, roomId, socketId };
}
exports.getUserFromSocket = getUserFromSocket;
//# sourceMappingURL=getUserFromSocket.js.map