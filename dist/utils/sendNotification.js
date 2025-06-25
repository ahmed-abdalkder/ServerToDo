"use strict";
// This component defines a utility function to send push notifications using the web-push library.
// It exports the sendNotification function as the default export.
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web_push_1 = __importDefault(require("web-push"));
// Import the web-push library and the PushSubscription type for typing the subscription parameter.
function sendNotification(subscription, payload) {
    return __awaiter(this, void 0, void 0, function* () {
        // Send a push notification to the given subscription with the provided payload.
        // The payload is converted to a JSON string before sending.
        yield web_push_1.default.sendNotification(subscription, JSON.stringify(payload));
    });
}
exports.default = sendNotification;
// Export the sendNotification function as the default export of this module.
