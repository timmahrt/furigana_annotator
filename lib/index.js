import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

const katakanaToHiraganaMapping = {
  'ア': 'あ',
  'イ': 'い',
  'ウ': 'う',
  'エ': 'え',
  'オ': 'お',
  'カ': 'か',
  'キ': 'き',
  'ク': 'く',
  'ケ': 'け',
  'コ': 'こ',
  'サ': 'さ',
  'シ': 'し',
  'ス': 'す',
  'セ': 'せ',
  'ソ': 'そ',
  'タ': 'た',
  'チ': 'ち',
  'ツ': 'つ',
  'テ': 'て',
  'ト': 'と',
  'ナ': 'な',
  'ニ': 'に',
  'ヌ': 'ぬ',
  'ネ': 'ね',
  'ノ': 'の',
  'ハ': 'は',
  'ヒ': 'ひ',
  'フ': 'ふ',
  'ヘ': 'へ',
  'ホ': 'ほ',
  'マ': 'ま',
  'ミ': 'み',
  'ム': 'む',
  'メ': 'め',
  'モ': 'も',
  'ヤ': 'や',
  'ユ': 'ゆ',
  'ヨ': 'よ',
  'ラ': 'ら',
  'リ': 'り',
  'ル': 'る',
  'レ': 'れ',
  'ロ': 'ろ',
  'ワ': 'わ',
  'ヲ': 'を',
  'ン': 'ん',
  'ガ': 'が',
  'ギ': 'ぎ',
  'グ': 'ぐ',
  'ゲ': 'げ',
  'ゴ': 'ご',
  'ザ': 'ざ',
  'ジ': 'じ',
  'ズ': 'ず',
  'ゼ': 'ぜ',
  'ゾ': 'ぞ',
  'ダ': 'だ',
  'ヂ': 'ぢ',
  'ヅ': 'づ',
  'デ': 'で',
  'ド': 'ど',
  'バ': 'ば',
  'ビ': 'び',
  'ブ': 'ぶ',
  'ベ': 'べ',
  'ボ': 'ぼ',
  'パ': 'ぱ',
  'ピ': 'ぴ',
  'プ': 'ぷ',
  'ペ': 'ぺ',
  'ポ': 'ぽ',
  'ヴ': 'ゔ',
  'ー': 'ー',
  'ァ': 'ぁ',
  'ィ': 'ぃ',
  'ゥ': 'ぅ',
  'ェ': 'ぇ',
  'ォ': 'ぉ',
};

function stringToHiragana(katakanaString) {
  const hiraganaArray = Array.from(katakanaString, char =>
    katakanaToHiraganaMapping[char] || char
  );

  return hiraganaArray.join('');
}

async function initializeKuromoji(dictPath) {
  // TODO: Maybe replace these with vanilla kuromoji?
  const kuroshiro = new Kuroshiro();
  const kuromoji = new KuromojiAnalyzer({ dictPath: dictPath })
  await kuroshiro.init(kuromoji);

  return kuromoji
}

export function toggleFurigana(hiddenClass) {
  var rubyElements = document.querySelectorAll('ruby rt');

  rubyElements.forEach(function (rtElement) {
    rtElement.classList.toggle(hiddenClass);
  });
}

// Given text, parse the text as Japanese text. For each parsed chunk, 
// wrap any kanji words in ruby tags. Recombine the chunks and return
// the resulting string.
export async function annotateContentWithRuby(kuromoji, textContent, hiddenClass) {
  const parsedChunks = await kuromoji.parse(textContent);
  const annotatedChunks = Array.from(parsedChunks, chunk => {
    if (!chunk.reading) {
      return chunk.surface_form
    }
    const hiraganaReading = stringToHiragana(chunk.reading)
    if (chunk.surface_form == hiraganaReading) {
      return chunk.surface_form
    } else {
      return `<ruby>${chunk.surface_form}<rt class="${hiddenClass}">${hiraganaReading}</rt> </ruby>`;
    }
  });

  return annotatedChunks.join('');
}

// Traverse the DOM recursively
// For any text nodes, if they contain kanji, wrap the kanji
// in ruby tags.
export async function addRubyAnnotationsToPage(dictPath, hiddenClass) {
  const kuromoji = await initializeKuromoji(dictPath)
  async function addRubyAnnotationsToNode(node) {
    if (node.nodeType === Node.TEXT_NODE) {
      const nodeText = node.nodeValue.trim();

      if (nodeText !== '') {
        const annotatedElement = document.createElement('span');
        annotatedElement.innerHTML = await annotateContentWithRuby(
          kuromoji, nodeText, hiddenClass
        );
        if (annotatedElement.innerHTML.includes("<ruby>")) {
          node.parentNode.innerHTML = annotatedElement.innerHTML;
        }
      }
    } else {
      for (let i = 0; i < node.childNodes.length; i++) {
        await addRubyAnnotationsToNode(node.childNodes[i]);
      }
    }
  }

  await addRubyAnnotationsToNode(document.body);
}
