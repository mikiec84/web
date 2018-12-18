# Generated by Django 2.1.2 on 2018-12-17 21:22

import datetime
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('grants', '0010_merge_20181217_2034'),
    ]

    operations = [
        migrations.AddField(
            model_name='grant',
            name='contract_owner_address',
            field=models.CharField(default='0x0', help_text='The wallet address that owns the subscription contract and is able to call endContract()', max_length=255),
        ),
        migrations.AlterField(
            model_name='grant',
            name='admin_address',
            field=models.CharField(default='0x0', help_text='The wallet address where subscription funds will be sent.', max_length=255),
        ),
        migrations.AlterField(
            model_name='subscription',
            name='next_contribution_date',
            field=models.DateTimeField(default=datetime.datetime(1990, 1, 1, 0, 0), help_text='The next contribution date'),
        ),
    ]