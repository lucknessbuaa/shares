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
    user = request.user
    social_user = UserSocialAuth.objects.get(user_id=user.id)
    username = social_user.extra_data['username']
    avatar = social_user.extra_data['profile_image_url']
    
    datenow = datetime.datetime.now()

    if datenow.hour >= 15:
        datenow = datenow + datetime.timedelta(days=1)
    shares = Shares(user=user, imageurl='', info='', createon=datenow)
    count = Shares.objects.count() 

    try:
        shares.save()
    except:
        redirect('/')

    return render(request, 'index.html', {
        'avatar': avatar,
        'username': username,
        'date': datenow,
        'id': shares.id,
        'count': count
    }) 

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
    id = int(request.POST.get('id'))

    shares = Shares.objects.get(id=id)
    shares.info = info
    shares.imageurl = dataURL
    shares.save()

    return render_json({
        'code': 0
    })
