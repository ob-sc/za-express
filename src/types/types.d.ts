export type FormValue = boolean | string;

// db

// wird durch mysql typecast in options object von connection zu boolean
export type TinyInt = boolean;
export type TinyIntNull = TinyInt | null;

export type Int = number;
export type IntNull = Int | null;

export type Float = number;
export type FloatNull = Float | null;

export type VarChar = string;
export type VarCharNull = VarChar | null;

export type DateStr = string;
export type DateStrNull = DateStr | null;

export type TimeStr = string;
export type TimeStrNull = TimeStr | null;

export type Timestamp = string;
