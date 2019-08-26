pragma solidity 0.4.24;

import "openzeppelin-solidity/contracts/token/ERC20/ERC20.sol";

contract MyFioriToken is ERC20 {
    string public name;
    string public symbol;
    uint256 public decimals;
    mapping(address => bool) private _toppedUpAccounts;
    
    constructor(string _name, string _symbol, uint8 _decimals)
      ERC20()
      public 
    {
      name = _name;
      symbol = _symbol;
      decimals = _decimals;
    }

    function deposit() public payable returns (bool) {
      bool result = false;
      if (!_toppedUpAccounts[msg.sender]) {
        uint256 value = msg.value * 10**decimals;
        increaseAllowance(msg.sender, value);
        result = mint(msg.sender, value);
        if (result) {
          _toppedUpAccounts[msg.sender] = result;
        }
      }
      return result;
    }

    function mint(address to, uint256 amount) public returns (bool) {
      _mint(to, amount);
      return true;
    }
}