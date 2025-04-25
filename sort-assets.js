// sort-assets.js
import fs from 'fs';
import path from 'path';

const inputDir = './src/assets/raw';
const outputBaseDir = './src/assets/decks';

const CARD_REGEX =
    /^(?:(dwarf|elves|goblin|human)_)?(ace|[2-9]|10|jack|queen|king)_of_(club|diamond|spade|heart)_(black|blue|cyan|bronze|gold|green|orange|purple|red|silver)_design_(\d)\.png$/i;

fs.readdirSync(inputDir).forEach((file) => {
    const match = file.match(CARD_REGEX);
    if (!match) return;

    const [_, race, numberRaw, suitRaw, color, variant] = match;

    const suit = `${suitRaw}s`; // plural
    const number = /^[2-9]$/.test(numberRaw)
        ? `0${numberRaw}` // pad single digit
        : numberRaw; // leave face cards and 10 unchanged

    const racePart = race ? `${race}_` : '';
    const dirName = `ttrpg_legacy_${racePart}${color}_${variant}`;
    const outputDir = path.join(outputBaseDir, dirName, suit);

    fs.mkdirSync(outputDir, { recursive: true });

    const sourcePath = path.join(inputDir, file);
    const destPath = path.join(outputDir, `${number}.png`);

    fs.renameSync(sourcePath, destPath);
});
