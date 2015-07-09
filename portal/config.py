#coding: utf-8
from django.shortcuts import render, redirect
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.decorators import login_required
from django.views.decorators.csrf import csrf_exempt
from datetime import datetime
from pymemcache.client import Client

import random
import time
import requests
import urllib
import hashlib
import logging

appid = 'wx1f80e9a9a612e417'
secret = '32c1641e52e67c4f103d0353f4d858b6'

logger = logging.getLogger(__name__)
client = Client(('localhost', 11211))

def update_access_token():
    get_js_ticket(get_access_token())

def get_access_token():
        r = requests.get("https://api.weixin.qq.com/cgi-bin/token?grant_type=client_credential&appid="+appid+"&secret="+secret)
        res = r.json()
        try:
            w = client.get('access_token')
        except Exception:
            w = None
        if w:
            client.delete('access_token')
        client.add('access_token', res['access_token'], 7200)

        return res['access_token']

def get_js_ticket(access_token):
        r = requests.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+access_token+"&type=jsapi")
        res = r.json()
        if res['errcode'] != 0:
            access_token = get_access_token()
            r = requests.get("https://api.weixin.qq.com/cgi-bin/ticket/getticket?access_token="+access_token+"&type=jsapi")
            res = r.json()
        client.delete('js_ticket')
        client.add('js_ticket', res['ticket'], 7200)
        return res['ticket']

def sign(js_ticket,url):
        s = "nameLR9969"
        timestamp = int(time.time())
        url = urllib.unquote(url)
        fullurl = "jsapi_ticket=" + js_ticket + "&noncestr=" + s +"&timestamp=" + str(timestamp) + "&url=" +url
        print fullurl
        sha1obj = hashlib.sha1()
        sha1obj.update(fullurl)
        hash = sha1obj.hexdigest()
        return {
            "hash":hash,
            "timestamp":timestamp
        }

@csrf_exempt
def wechatConfig(request): 
    url = request.GET.get('url')
    print 'url'
    print url
    
    js_ticket = client.get('js_ticket')
    access_token = client.get('access_token')
    print 'access_token', access_token

    if (not js_ticket) or (not access_token):
        s = update_access_token()
        js_ticket = client.get('js_ticket')
        access_token = client.get('access_token')

    s = sign(js_ticket, url)
    print 'signature', s['hash']

    json = {
        "code": 0,
        "appid": appid,
        "timestamp":s['timestamp'],
        "noncestr":'nameLR9969',
        "signature":s['hash']
    }
    return JsonResponse(json)
