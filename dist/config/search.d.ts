import { OptionsDto } from "./dto/options.dto";
export declare const prepareParams: (options: OptionsDto, actualParams?: {}, relationsModels?: {}, selectParams?: {}) => {
    where: {
        AND: {};
    };
    orderBy: {};
    take: number;
    skip: number;
};
