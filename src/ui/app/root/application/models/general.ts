export interface GeneralModel {
    id: string;
    text: string;
};

export interface GroupModel {
    text: string;
    children: Array<GeneralModel>;
}
