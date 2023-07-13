function keccak256(org) {
  return ethers.keccak256(ethers.toUtf8Bytes(org)).slice(2);
}

function saltHash(hash, salt) {
  return keccak256(`${hash}${salt}`);
}

function calculateGameResult(gameHash, salt) {
  const nBits = 52;
  let hash = saltHash(gameHash, salt);
  hash = hash.slice(0, nBits / 4);
  const r = parseInt(hash, 16);
  let X = r / Math.pow(2, nBits);
  X = parseFloat(X.toPrecision(9));
  X = Math.floor(99 / (1 - X));
  return Math.max(1, X / 100);
}

function getQueryVariable(variable) {
  var query = window.location.search.substring(1);
  var vars = query.split("&");
  for (var i = 0; i < vars.length; i++) {
    var pair = vars[i].split("=");

    if (decodeURIComponent(pair[0]) == variable) {
      return decodeURIComponent(pair[1]);
    }
  }
  return null;
}

// USAGE:

jQuery(function ($) {
  var qhash = getQueryVariable("hash");

  if (qhash) {
    $("#hash").val(qhash);
  }

  function displayResult() {
    var hash = $("#hash").val();
    var salt = $("#salt").val();
  }

  function displayPreviousRounds() {
    var hash = $("#hash").val();
    var salt = $("#salt").val();
    var amountOfGames = $("#amountOfGames").val();

    if (hash.length !== 64 || salt.length !== 64) {
      return false;
    }

    var lastServerHash = hash;
    var hashList = [];
    hashList.push({ hash: hash, result: calculateGameResult(hash, salt) });
    for (var i = 0; i < amountOfGames - 1; i++) {
      lastServerHash = keccak256(lastServerHash);
      var result = calculateGameResult(lastServerHash, salt);
      hashList.push({ hash: lastServerHash, result: result });
    }

    $("#prev-hashes").empty();
    hashList.forEach(function (hset, idx) {
      var result = hset.result.toFixed(2) + "x";
      var hash = hset.hash;

      if (idx === 0) {
        hash += " (current)";
      }

      var $row = $("<tr></tr>");
      var $hash = $("<td class='prev-data'><code>" + hash + "</code></td>");
      var $result = $("<td class='result'>" + result + "</td>");

      if (hset.result >= 10.01) {
        $result.addClass("gold");
      } else if (hset.result >= 2.01) {
        $result.addClass("blue");
      } else {
        $result.addClass("red");
      }

      $row.append($hash).append($result);
      $("#prev-hashes").append($row);
    });
  }

  $("#calc").click(function () {
    displayResult();
    displayPreviousRounds();
  });

  $("#hash").change(function () {
    displayResult();
    displayPreviousRounds();
  });

  $("#salt").change(function () {
    displayResult();
    displayPreviousRounds();
  });

  displayResult();
  displayPreviousRounds();
});
