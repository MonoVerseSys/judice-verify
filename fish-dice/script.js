function getUrlVars() {
  var vars = {};
  var parts = window.location.href.replace(
    /[?&]+([^=&]+)=([^&]*)/gi,
    function (m, key, value) {
      vars[key] = value;
    }
  );
  return vars;
}

function verifySeed(serverSeed, clientSeed, nonce) {
  var seedStringUtf8Bytes = ethers.utils.toUtf8Bytes(
    `${serverSeed}:${clientSeed}:${nonce}`
  );

  var hashValue = ethers.utils.keccak256(seedStringUtf8Bytes);

  var resultRandomNum = new BigNumber(hashValue).mod(6).toNumber() + 1;

  return resultRandomNum;
}

$(document).ready(async function () {
  var vars = getUrlVars();
  var serverSeed = vars["serverSeed"];
  var clientSeed = vars["clientSeed"];
  var nonce = vars["nonce"];

  $("#server-seed").val(serverSeed);
  $("#client-seed").val(clientSeed);
  $("#nonce").val(nonce);

  function randomResult() {
    var serverSeed = $("#server-seed").val();
    var clientSeed = $("#client-seed").val();
    var nonce = $("#nonce").val();
    if (!serverSeed || !clientSeed || !nonce) {
      alert("not enough input data");
      return;
    }
    var result = verifySeed(serverSeed, clientSeed, nonce);
    $("#result").val(result);
  }

  randomResult();

  $(".calc-btn").on("click", function () {
    randomResult();
  });

  $("#server-seed").change(function () {
    serverSeed = $("#server-seed").val();
  });

  $("#client-seed").change(function () {
    clientSeed = $("#client-seed").val();
  });

  $("#nonce").change(function () {
    nonce = $("#nonce").val();
  });

  $(".reset-btn").on("click", function () {
    $("#server-seed").val("");
    $("#client-seed").val("");
    $("#nonce").val("");
    $("#result").val("");
  });
});
