#coding:utf-8
import json
import datetime
from django.shortcuts import render, redirect
from django.http import HttpResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django_render_json import render_json
from django.views.decorators.csrf import csrf_exempt
from social_auth.db.django_models import UserSocialAuth

from portal.models import Shares

import logging

logger = logging.getLogger(__name__)

def login(request):
    if request.user and request.user.is_active:
        return redirect('index')
    next = request.GET.get('next', '')
    url = '/login/weixin?next=' + next
    return redirect(url)

@login_required
def index(request):
    return render(request, 'index.html') 

#@login_required
def visit(request, id):
    shares = Shares.objects.get(id=id)
    social_user = UserSocialAuth.objects.get(user_id=shares.user.id)
    username = social_user.extra_data['username']
    avatar = social_user.extra_data['profile_image_url']
    createon = shares.createon
    
    return render(request, 'visit.html', {
        'dataURL': shares.imageurl,
        'info': shares.info,
        'username': username,
        'avatar': avatar,
        'createon': createon
    })

@csrf_exempt
def addShare(request):
    dataURL = request.POST.get('dataURL', '')
    info = request.POST.get('info', '')

    if request.user and request.user.is_anonymous():
        return render_json({
            'code': 2002
        })    
    else:
        user = request.user

    datenow = datetime.datetime.now()
    if datenow.hour >= 15:
        datenow = datenow + datetime.timedelta(days=1)
    shares = Shares(user=user, imageurl=dataURL, info=info, createon=datenow)
    
    try:
        shares.save()
        num = shares.id
    except:
        return render_json({
            'code': 2001
        })
    
    return render_json({
        'code': 0,
        'id': num,
        'username': user.username,
        'dateM': datenow.strftime('%m'),
        'dateD': datenow.strftime('%d')
    })
