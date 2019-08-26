// /*global contract, config, it, assert*/

const MyFioriToken = require('Embark/contracts/MyFioriToken');
const { toWei, fromWei } = web3.utils;

contract("MyFioriToken", function (accounts) {
  const _name = "Fiori Token";
  const _symbol = "FIO";
  const _decimals = 0;
  let fcInstance;

  beforeEach(async function () {
    fcInstance = await MyFioriToken.deploy({ arguments: [_name, _symbol, _decimals] }).send();
  });

  it("Should create a contract with zero supply", async function () {
    let result = await fcInstance.methods.totalSupply().call();
    assert.equal(fromWei(result, 'wei'), 0);
  });

  it("Should create a contract with zero balance for an account", async function () {
    const account0 = accounts[0];
    let result = await fcInstance.methods.balanceOf(account0).call();
    assert.equal(fromWei(result, 'wei'), 0);
  });

  it("Should mint tokens for an account", async function () {
    const account0 = accounts[0];
    await fcInstance.methods.deposit().send({ from: account0, value: toWei('10', 'wei') });
    const result = await fcInstance.methods.balanceOf(account0).call();
    const balance = parseFloat(fromWei(result, 'wei'));
    assert.equal(balance, '10');
  });

  it("Should not allow minting tokens for same account twice", async function () {
    const account0 = accounts[0];
    await fcInstance.methods.deposit().send({ from: account0, value: toWei('10', 'wei') });
    await fcInstance.methods.deposit().send({ from: account0, value: toWei('10', 'wei') });
    const result = await fcInstance.methods.balanceOf(account0).call();
    const balance = parseFloat(fromWei(result, 'wei'));
    assert.equal(balance, 10);
  });

  it("Should pass tokens between accounts", async function () {
    const account0 = accounts[0];
    const account1 = accounts[1];

    await fcInstance.methods.deposit().send({ from: account0, value: toWei('10', 'wei') });
    const result0 = await fcInstance.methods.balanceOf(account0).call();
    const balance0 = parseFloat(fromWei(result0, 'wei'));
    assert.equal(balance0, 10);

    await fcInstance.methods.deposit().send({ from: account1, value: toWei('10', 'wei') });
    const result1 = await fcInstance.methods.balanceOf(account1).call();
    const balance1 = parseFloat(fromWei(result1, 'wei'));
    assert.equal(balance1, 10);

    await fcInstance.methods.transfer(account1, toWei('2', 'wei')).send({ from: account0 });
    const result2 = await fcInstance.methods.balanceOf(account1).call();
    const balance2 = parseFloat(fromWei(result2, 'wei'));
    assert.equal(balance2, 12);

    const result3 = await fcInstance.methods.balanceOf(account0).call();
    const balance3 = parseFloat(fromWei(result3, 'wei'));
    assert.equal(balance3, 8);
  });
});
