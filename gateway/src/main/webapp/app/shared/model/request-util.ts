import { URLSearchParams, BaseRequestOptions } from '@angular/http';

export const createRequestOption = (req?: any): BaseRequestOptions => {
    const options: BaseRequestOptions = new BaseRequestOptions();
    if (req) {
        const params: URLSearchParams = new URLSearchParams();
        params.set('page', req.page);
        params.set('size', req.size);
        if (req.sort) {
            params.paramsMap.set('sort', req.sort);
        }
        params.set('query', req.query);

        options.params = params;
    }
    return options;
};

export const createCustomRequestOption = (req?: any): BaseRequestOptions => {
    const options: BaseRequestOptions = new BaseRequestOptions();
    if (req) {
        const params: URLSearchParams = new URLSearchParams();
        params.set('page', req.page);
        params.set('size', req.size);
        if (req.sort) {
            params.paramsMap.set('sort', req.sort);
        }
        params.set('type', req.type);
        params.set('dept', req.dept);
        params.set('date', req.date);
        params.set('place', req.place);

        console.log(params);

        options.params = params;
    }
    return options;
};
