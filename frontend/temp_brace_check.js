const fs = require('fs');
const path = require('path');
const file = path.join(__dirname, 'src', 'LanguageContext.tsx');
const text = fs.readFileSync(file, 'utf8');
const stack = [];
const lines = text.split(/\r?\n/);
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  for (const c of line) {
    if (c === '{') stack.push([i + 1, line]);
    else if (c === '}') {
      if (stack.length) stack.pop();
      else console.log('extra closing', i + 1, line);
    }
  }
}
console.log('remaining opens', stack.length);
for (const [i, line] of stack.slice(-20)) {
  console.log('open at', i, line);
}
