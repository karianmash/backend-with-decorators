import { RequestHandler } from "express";
import "reflect-metadata";
import { Metadatakeys, Methods } from "./method";

interface RouteHandlerDescriptor extends PropertyDescriptor {
  value?: RequestHandler;
}

function routeBinder(method: string) {
  return function (path: string) {
    return function (
      target: any,
      propertykey: string | symbol,
      descriptor: RouteHandlerDescriptor
    ) {
      Reflect.defineMetadata(Metadatakeys.Path, path, target, propertykey);
      Reflect.defineMetadata(Metadatakeys.Method, method, target, propertykey);
    };
  };
}

export const Get = routeBinder(Methods.Get);
export const Post = routeBinder(Methods.Post);
export const Put = routeBinder(Methods.Put);
export const Patch = routeBinder(Methods.Patch);
export const Delete = routeBinder(Methods.Delete);
