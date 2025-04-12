import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface Message {
  'id' : bigint,
  'content' : string,
  'sender' : UserId,
  'timestamp' : Time,
}
export type Result = { 'ok' : boolean } |
  { 'err' : string };
export type Result_1 = { 'ok' : bigint } |
  { 'err' : string };
export type Result_2 = { 'ok' : Array<User> } |
  { 'err' : string };
export type Result_3 = { 'ok' : Array<Message> } |
  { 'err' : string };
export type Result_4 = { 'ok' : [] | [User] } |
  { 'err' : string };
export type Result_5 = { 'ok' : Array<[UserId, Username]> } |
  { 'err' : string };
export type Result_6 = { 'ok' : User } |
  { 'err' : string };
export interface Status { 'isOnline' : boolean, 'lastActive' : Time }
export type Time = bigint;
export interface User {
  'id' : UserId,
  'pid' : Principal,
  'status' : Status,
  'username' : Username,
}
export type UserId = bigint;
export type Username = string;
export interface _SERVICE {
  'createUser' : ActorMethod<[string], Result_6>,
  'getActiveUsers' : ActorMethod<[[] | [User]], Result_5>,
  'getCurrentUser' : ActorMethod<[], Result_4>,
  'getLastMessageIndex' : ActorMethod<[bigint], Result_1>,
  'getMessages' : ActorMethod<[bigint, bigint, bigint], Result_3>,
  'getUsersByIds' : ActorMethod<[Array<UserId>], Result_2>,
  'isUsernameFree' : ActorMethod<[string], boolean>,
  'leaveChannel' : ActorMethod<[], Result>,
  'sendMessage' : ActorMethod<[string], Result_1>,
  'updateUserActivity' : ActorMethod<[], Result>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
