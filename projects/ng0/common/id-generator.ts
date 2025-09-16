export abstract class IdGenerator {
    private static _idCounter = 0;

    public static next(): number {
        return IdGenerator._idCounter++;
    }
}
