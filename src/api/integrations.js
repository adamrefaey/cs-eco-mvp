import { client } from './client';

// Integration exports using the new client structure
export const Core = client.integrations.Core;
export const InvokeLLM = client.integrations.Core.InvokeLLM;
export const SendEmail = client.integrations.Core.SendEmail;
export const UploadFile = client.integrations.Core.UploadFile;
export const GenerateImage = client.integrations.Core.GenerateImage;
export const ExtractDataFromUploadedFile = client.integrations.Core.ExtractDataFromUploadedFile;
export const CreateFileSignedUrl = client.integrations.Core.CreateFileSignedUrl;
export const UploadPrivateFile = client.integrations.Core.UploadPrivateFile;






