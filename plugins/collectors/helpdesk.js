var Plugin_Helpdesk = function() {
  
}

Plugin_Helpdesk.prototype.get = function() {
  return "This be the helpdesk.Get";
}

Plugin_Helpdesk.prototype.tickets = function() {
  function genRandNum(max) {
    max = ((typeof max === 'undefined') ? 1 : max) + 1;
    return Math.floor(Math.random() * max);
  }

  return {
    "Amber": { "open": genRandNum(10), "waiting_for_customer": genRandNum(10) },
    "Brett": { "open": genRandNum(10), "waiting_for_customer": genRandNum(10) },
    "Carter": { "open": genRandNum(10), "waiting_for_customer": genRandNum(10) }
  };
}

module.exports = Plugin_Helpdesk;
