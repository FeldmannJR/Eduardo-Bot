export function toBinary(input: string):string {
  let output = '';
  for (let i = 0; i < input.length; i += 1) {
    output += `${input[i].charCodeAt(0).toString(2)} `;
  }
  return output;
}
export function fromBinary(value: string): string {
  return value;
}
