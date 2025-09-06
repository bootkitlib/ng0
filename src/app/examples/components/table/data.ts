import { ArrayDataSource } from "@bootkit/ng0/data";

export const Array1 = new Array<any>();
export const Array2 = new Array<any>();

for (let i = 1; i <= 100; i++) {
    Array1.push({ id: i, name: `Item ${i}`, description: `Description ${i}` })
}

for (let i = 101; i <= 300; i++) {
    Array2.push({ id: i, name: `Item ${i}`, description: `Description ${i}` })
}