import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { env } from '../../environments/environment';
import { Observable, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NiubizService {
  private readonly apiUrl = env.niubizUrl;
  private readonly username = env.niubizAccessKey;
  private readonly password = env.niubizSecretKey;
  private readonly merchantId = env.niubizMerchantId;

  constructor(private readonly http: HttpClient) {}

  getNiubizToken(): Observable<string> {
    const auth = 'Basic ' + btoa(`${this.username}:${this.password}`);
    const headers = new HttpHeaders({
      Authorization: auth,
      'Content-Type': 'text/plain',
    });

    return this.http.get(`${this.apiUrl}api.security/v1/security`, {
      headers,
      responseType: 'text',
    });
  }

  getNiubizSession(amount: number): Observable<any> {
    return this.getNiubizToken().pipe(
      switchMap((token: string) => {
        const urlApi = `${this.apiUrl}api.ecommerce/v2/ecommerce/token/session/${this.merchantId}`;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: token,
          Accept: 'application/json',
        });

        const body = {
          channel: 'web',
          amount: amount,
          antifraud: {
            clientIp: '127.0.0.1',
            merchantDefineData: {
              MDD4: 'cfvgbh@gvbh.gvhb',
              MDD21: 0,
              MDD32: '20137911982',
              MDD75: 'Registrado',
              MDD77: 120,
            },
          },
        };

        return this.http.post(urlApi, body, {
          headers,
          responseType: 'json',
        });
      })
    );
  }

  getNiubizAuthorization(
    amount: number,
    purchaseNumber: number,
    channel: string,
    tokenId: string
  ): Observable<any> {
    return this.getNiubizToken().pipe(
      switchMap((token: string) => {
        const urlApi = `${this.apiUrl}api.authorization/v3/authorization/ecommerce/${this.merchantId}`;
        const headers = new HttpHeaders({
          'Content-Type': 'application/json',
          Authorization: token,
          Accept: 'application/json',
        });

        const body = {
          captureType: 'manual',
          channel,
          countable: true,
          order: {
            amount: amount,
            currency: 'PEN',
            purchaseNumber: purchaseNumber,
            tokenId,
          },
        };
        return this.http.post(urlApi, body, {
          headers,
          responseType: 'json',
        });
      })
    );
  }
}
