import { Sexuality } from "src/app/common/enums";

// Array 1
export const Array1 = new Array<any>();
for (let i = 1; i <= 3; i++) {
    Array1.push({
        id: i,
        name: `Item ${i}`,
        sexuality: Sexuality.female,
        boolean1: i % 2 == 0,
        boolean2: i % 2 == 0,
        boolean3: i % 2 == 0,
        date1: Date(),
        description: `Description ${i}`,
        nested: {
            value: `Nested Value ${i}`
        }
    })
}

// Array 2
export const Array2 = new Array<any>();
for (let i = 1; i <= 100; i++) {
    Array2.push({
        id: i,
        name: `Item ${i}`,
        sexuality: Sexuality.male,
        description: `Description ${i}`,
        nested: {
            value: `Nested Value ${i}`
        }
    })
}
