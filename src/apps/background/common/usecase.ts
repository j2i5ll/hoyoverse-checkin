export interface Usecase<TParam, TReturn> {
  execute(param: TParam): TReturn;
}
