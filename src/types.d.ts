// Generic ambient module to read YAML (.yml) files
declare module '*.yml';

interface Styled {
  className: string;
}

interface Cta {
  title: string;
  href: string;
}

/*
 * The following is a better intellisense friendly version of something like:
 *
 * type PartiallyOptional<T, K extends keyof T> = Partial<Pick<T, K>> && Omit<T, K>;
 *
 * This is because defining these generics through mappings will show
 * the true shape of the type in the editor tips, instead of the utility types
 */
type PartiallyOptional<T, K extends keyof T> = {
  [k in K]+?: T[k];
} & {
  [k in keyof T as Exclude<k, K>]: T[k];
};

/* Same with this one:
 *
 * type PartiallyRequired<T, K extends keyof T> = Required<Pick<T, K>> & Omit<T, K>;
 */
type PartiallyRequired<T, K extends keyof T> = T & { [k in K]-?: T[k] };
