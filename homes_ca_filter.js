const text = `【渋谷区】
上原  1～2  鶯谷町、宇田川町、恵比寿  1～4、恵比寿西  1～2、恵比寿南  1～3、
神山町、桜丘町、猿楽町、渋谷  1～4、松涛  1～2、神泉町、神宮前  1～6、
神南  1～2、千駄ヶ谷  1～6、代官山町、富ヶ谷  1～2、道玄坂  1～2、南平台町、
鉢山町、東  1～4、広尾  1～5、円山町、元代々木町、代々木  1～3、代々木 5、
代々木神園町
【目黒区】
青葉台  1～4、大橋  1～2、駒場  1～4、東山  1～3、三田  1～2、目黒  1～4、
上目黒  1～5、中目黒  1～5、下目黒  1～4
【世田谷区】
池尻  1～4、上馬  1～2、下馬  1～4、三軒茶屋  1～2、代沢  1、太子堂  1～5、
野沢1、三宿  1～2、若林  1～2
【品川区】
上大崎  1～4、西五反田  3、東五反田 5
【港区】
赤坂  7～9、元赤坂  2、北青山 2～3、南青山  1～7、白金 5、白金台 3、白金台 5、
西麻布  1～4、南麻布  3～5、元麻布  2～3、六本木  7
【新宿区】
霞ヶ丘町`;

function extractAddresses(district, text) {
  const regex = new RegExp(`${district}.*?\\n([\\s\\S]*?)(?:\\n【|$)`, "g");
  const matches = [...text.matchAll(regex)];
  if (!matches.length) return [];

  const addressLines = matches[0][1];
  const addressParts = addressLines.split(/、|\n/);

  let addresses = [];
  addressParts.forEach((part) => {
    const nameNumberPair = part.trim().split(/\s+/);
    if (nameNumberPair.length === 1) {
      addresses.push(`${district}${nameNumberPair[0]}`);
    } else {
      const [name, numbers] = nameNumberPair;
      const numberRange = numbers.split("～");
      if (numberRange.length === 1) {
        addresses.push(`${district}${name}${numberRange[0]}`);
      } else {
        for (
          let i = parseInt(numberRange[0]);
          i <= parseInt(numberRange[1]);
          i++
        ) {
          addresses.push(`${district}${name}${i}`);
        }
      }
    }
  });

  return addresses;
}

const sections = ["渋谷区", "目黒区", "世田谷区", "品川区", "港区", "新宿区"];

const addressArray = sections
  .flatMap((section) => extractAddresses(section, text))
  .filter((address) => !sections.some((section) => section === address));

console.log(addressArray);

function periodicallyCheckAddresses() {
  // 特定のクラス名を持つすべてのdiv要素を取得
  const divElements = document.querySelectorAll(".ui-frame");

  console.log(divElements.length);

  divElements.forEach((div) => {
    // 各div要素内の住所を取得
    let address = null;
    const tbody = div.querySelector("tbody");
    if (tbody) {
      const rows = tbody.querySelectorAll("tr");
      rows.forEach((row) => {
        const th = row.querySelector("th");
        if (th && th.textContent.trim() === "所在地") {
          address = row.querySelector("td").textContent.trim();
        }
      });
    }

    const addressElement = div.querySelector(".address");
    if (addressElement) {
      const address = addressElement.textContent.trim() ?? address;
    }

    if (address == null) {
      console.log("wrong div: %o", div);
      return;
    }

    // 住所が配列内のいずれとも一致しない場合、div要素を削除
    const isAddressMatched = addressArray.some(
      (addr) => address.indexOf(addr) > -1
    );
    if (!isAddressMatched) {
      div.remove();
      return;
    }

    console.log("address:", address);
  });
}

// 1秒ごとにperiodicallyCheckAddresses関数を実行
setInterval(periodicallyCheckAddresses, 1000);
