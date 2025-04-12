export const idlFactory = ({ IDL }) => {
  const UserId = IDL.Nat;
  const Time = IDL.Int;
  const Status = IDL.Record({ 'isOnline' : IDL.Bool, 'lastActive' : Time });
  const Username = IDL.Text;
  const User = IDL.Record({
    'id' : UserId,
    'pid' : IDL.Principal,
    'status' : Status,
    'username' : Username,
  });
  const Result_6 = IDL.Variant({ 'ok' : User, 'err' : IDL.Text });
  const Result_5 = IDL.Variant({
    'ok' : IDL.Vec(IDL.Tuple(UserId, Username)),
    'err' : IDL.Text,
  });
  const Result_4 = IDL.Variant({ 'ok' : IDL.Opt(User), 'err' : IDL.Text });
  const Result_1 = IDL.Variant({ 'ok' : IDL.Nat, 'err' : IDL.Text });
  const Message = IDL.Record({
    'id' : IDL.Nat,
    'content' : IDL.Text,
    'sender' : UserId,
    'timestamp' : Time,
  });
  const Result_3 = IDL.Variant({ 'ok' : IDL.Vec(Message), 'err' : IDL.Text });
  const Result_2 = IDL.Variant({ 'ok' : IDL.Vec(User), 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Bool, 'err' : IDL.Text });
  return IDL.Service({
    'createUser' : IDL.Func([IDL.Text], [Result_6], []),
    'getActiveUsers' : IDL.Func([IDL.Opt(User)], [Result_5], ['query']),
    'getCurrentUser' : IDL.Func([], [Result_4], ['query']),
    'getLastMessageIndex' : IDL.Func([IDL.Nat], [Result_1], ['query']),
    'getMessages' : IDL.Func(
        [IDL.Nat, IDL.Nat, IDL.Nat],
        [Result_3],
        ['query'],
      ),
    'getUsersByIds' : IDL.Func([IDL.Vec(UserId)], [Result_2], ['query']),
    'isUsernameFree' : IDL.Func([IDL.Text], [IDL.Bool], ['query']),
    'leaveChannel' : IDL.Func([], [Result], []),
    'sendMessage' : IDL.Func([IDL.Text], [Result_1], []),
    'updateUserActivity' : IDL.Func([], [Result], []),
  });
};
export const init = ({ IDL }) => { return []; };
