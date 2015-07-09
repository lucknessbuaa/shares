from django.conf.urls import patterns, include, url
from django.contrib import admin

urlpatterns = patterns('',
    url(r'', include('social.apps.django_app.urls', namespace='social')),
    url(r'^$', 'portal.views.index'),
    url(r'^login$', 'portal.views.login'),
    url(r'^share/add$', 'portal.views.addShare'),
    url(r'^share/(?P<id>\d+)$', 'portal.views.visit'),
    url(r'^api/wechat/config$', 'portal.config.wechatConfig')
)
