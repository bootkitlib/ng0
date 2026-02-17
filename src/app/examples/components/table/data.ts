import { LocalDataSource } from "@bootkit/ng0/data";
import { delay, of } from "rxjs";
// Array 1
export const Array1 = new Array<any>();
for (let i = 1; i <= 3; i++) {
    Array1.push({ id: i, name: `Item ${i}`, description: `Description ${i}` })
}

// Array 2
export const Array2 = new Array<any>();
for (let i = 1; i <= 100; i++) {
    Array2.push({ id: i, name: `Item ${i}`, description: `Description ${i}` })
}
