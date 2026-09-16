async function test() {
  const login = {};
  const loginContextSendOtp = async (phone) => {
    return { success: true, from: 'context' };
  };
  const res = await login.sendOtp ? await login.sendOtp('123') : await loginContextSendOtp('123');
  console.log(res);
}
test();
